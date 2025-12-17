require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const User = require('./models/User');

const { isValidEmail, isStrongPassword } = require('./utils/userUtils');


const app = express();
const PORT = process.env.PORT || 3000;

/* MongoDB connection */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/secomp_db';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/* Security */
app.use(helmet());

/* View engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Session stored in Mongo */
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI, ttl: 14*24*60*60 }),
  cookie: { httpOnly: true, sameSite: 'lax' } // secure: true in production with HTTPS
}));

/* Rate limiter for login */
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, try again later.'
});

/* CSRF protection (exempt POST /login) */
const csrfProtection = csrf();
app.use((req,res,next)=>{
  if (req.path === '/login' && req.method === 'POST') return next();
  return csrfProtection(req,res,next);
});

/* expose csrfToken and user to views */
app.use((req,res,next)=>{
  try { res.locals.csrfToken = req.csrfToken ? req.csrfToken() : ''; } catch(e){ res.locals.csrfToken = ''; }
  res.locals.user = req.session.user || null;
  next();
});

/* Auth helpers */
function isAuth(req,res,next){ if(req.session && req.session.user) return next(); res.redirect('/login'); }
function isAdmin(req,res,next){ if(req.session && req.session.user && req.session.user.is_admin) return next(); res.status(403).send('Forbidden'); }

/* Routes */
app.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !isStrongPassword(password)) {
    return res.status(400).send('Dados inválidos');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send('Credenciais inválidas');
  }

  const passwordOk = await bcrypt.compare(password, user.password_hash);
  if (!passwordOk) {
    return res.status(401).send('Credenciais inválidas');
  }

  req.session.user = {
    id: user._id.toString(),
    email: user.email,
    is_admin: user.is_admin
  };

  res.redirect('/profile');
});


app.get('/logout', (req,res)=> {
  req.session.destroy(()=> { res.clearCookie('connect.sid'); res.redirect('/'); });
});

app.get('/profile', isAuth, (req,res)=> res.render('profile'));
app.get('/admin', isAuth, isAdmin, (req,res)=> res.render('admin'));

app.post('/contact', (req,res)=>{
  const { name, email, message } = req.body || {};
  if(!name||!email||!message) return res.status(400).send('Fill all fields');
  // basic sanitization
  const clean = { name: String(name).replace(/[<>]/g,''), email: String(email).replace(/[<>]/g,''), message: String(message).replace(/[<>]/g,'') };
  console.log('Contact:', clean);
  res.send('Mensagem recebida');
});

app.use((req,res)=> res.status(404).render('404'));

/* seed admin */
async function seedAdmin(){
  try{
    const existing = await User.findOne({ email: 'admin@ufrr.br' }).exec();
    if(!existing){
      const hash = await bcrypt.hash('Admin@123', 10);
      await User.create({ email: 'admin@ufrr.br', password_hash: hash, is_admin: true });
      console.log('Seeded admin user: admin@ufrr.br / Admin@123');
    }
  }catch(e){console.error('seed error', e);}
}

app.listen(PORT, async ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
  await seedAdmin();
});
