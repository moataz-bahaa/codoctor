import { Router } from 'express';
import {
  deleteCertificate,
  deleteClinc,
  getCertificates,
  getClinc,
  getClincs,
  getDoctorProfile,
  getOfflineConsulations,
  getOnlineConsultation,
  getReviews,
  patchCertificate,
  postCertificate,
  postClinc,
  postSignup,
  searchByNameOrSpecialization,
} from '../controllers/doctor.js';
import { isAdminOrDoctor, isDoctor } from '../middlewares/auth.js';
import upload from '../utils/upload.js'

const router = Router();

router
  .route('/clincs')
  .post(postClinc)
  .delete(deleteClinc);

router.get('/', searchByNameOrSpecialization);

router.get('/:id', getDoctorProfile);

router.get('/:id/clincs', getClincs);

router.get('/:id/reviews', getReviews);

router.get('/:id/certificates', getCertificates);

router.post('/certificate', isDoctor, upload.single('image'), postCertificate)

router.patch('/certificate/:id', isDoctor, upload.single('image'), patchCertificate)

router.delete('/certificate', isDoctor, deleteCertificate)

router.post('/auth/signup', postSignup);

router.get('/clincs/:id', getClinc);

router.get('/offline-consultations', isAdminOrDoctor, getOfflineConsulations);

router.get('/online-consultations', isAdminOrDoctor, getOnlineConsultation);

export default router;
