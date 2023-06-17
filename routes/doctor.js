import { Router } from 'express';
import {
  deleteCertificate,
  deleteClinc,
  getCertificates,
  getClinc,
  getClincs,
  getDoctorProfile,
  getDoctorSchedule,
  getOfflineConsulations,
  getOnlineConsultation,
  getReviews,
  getSpecializations,
  patchCertificate,
  postCertificate,
  postClinc,
  postSignup,
  getDoctors,
  getUnVerifiedDoctors,
} from '../controllers/doctor.js';
import { isAdminOrDoctor, isDoctor } from '../middlewares/auth.js';
import upload from '../utils/upload.js';

const router = Router();

router.get('/', getDoctors);

router.get('/unverified', getUnVerifiedDoctors);

router.get('/schedule', isDoctor, getDoctorSchedule);

router.get('/specializations', getSpecializations);

router.post('/clincs', isDoctor, postClinc);

router.get('/clincs/:id', getClinc);

router.delete('/clincs/:id', isDoctor, deleteClinc);

router.post('/certificate', isDoctor, upload.single('image'), postCertificate);

router.patch(
  '/certificate/:id',
  isDoctor,
  upload.single('image'),
  patchCertificate
);

router.delete('/certificate/:id', isDoctor, deleteCertificate);

router.post('/auth/signup', postSignup);

router.get('/offline-consultations', isAdminOrDoctor, getOfflineConsulations);

router.get('/online-consultations', isAdminOrDoctor, getOnlineConsultation);

router.get('/:id', getDoctorProfile);

router.get('/:id/clincs', getClincs);

router.get('/:id/reviews', getReviews);

router.get('/:id/certificates', getCertificates);

export default router;
