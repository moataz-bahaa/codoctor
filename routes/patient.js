import { Router } from 'express';
import {
  getPatientProfile,
  postBookOnlineConsultation,
  postDoctorReview,
  postSignup,
} from '../controllers/paitent.js';
import { isAuth, isPatient } from '../middlewares/auth.js';

const router = Router();

router.post('/signup', postSignup);

router.get('/profile/:patientId', getPatientProfile);

router.post('/doctor-review', isPatient, postDoctorReview);

router.post('/book/online', isPatient, postBookOnlineConsultation);

export default router;
