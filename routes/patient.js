import { Router } from 'express';
import {
  postPaymentIntent,
  getPatientProfile,
  postBookOnlineConsultation,
  postDiseasePrediction,
  postDoctorReview,
  postPatientPreviousMedicinesAndDiseases,
  postSignup,
} from '../controllers/paitent.js';
import { isAuth, isPatient } from '../middlewares/auth.js';

const router = Router();

router.post('/signup', postSignup);

router.post('/profile', isPatient, postPatientPreviousMedicinesAndDiseases);

router.get('/profile/:patientId', getPatientProfile);

router.post('/doctor-review', isPatient, postDoctorReview);

router.post('/book/online', isPatient, postBookOnlineConsultation);

router.post('/disease-prediction', postDiseasePrediction);

router.post('/create-payment-intent', postPaymentIntent);

export default router;
