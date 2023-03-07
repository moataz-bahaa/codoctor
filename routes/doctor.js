import { Router } from 'express';
import {
  deleteClinc,
  getCertificates,
  getClinc,
  getClincs,
  getDoctorProfile,
  getOfflineConsulations,
  getOnlineConsultation,
  getReviews,
  postClinc,
  postSignup,
  searchByNameOrSpecialization,
} from '../controllers/doctor.js';
import { isAdminOrDoctor } from '../middlewares/auth.js';

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

router.post('/auth/signup', postSignup);

router.get('/clincs/:id', getClinc);

router.get('/offline-consultations', isAdminOrDoctor, getOfflineConsulations);

router.get('/online-consultations', isAdminOrDoctor, getOnlineConsultation);

export default router;
