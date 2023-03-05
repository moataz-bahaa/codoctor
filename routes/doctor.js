import { Router } from 'express';
import {
  deleteClinc,
  getClinc,
  getClincs,
  getOfflineConsulations,
  getOnlineConsultation,
  postClinc,
  postSignup,
} from '../controllers/doctor.js';
import { isAdminOrDoctor } from '../middlewares/auth.js';

const router = Router();

router
  .route('/clincs')
  .all(isAdminOrDoctor)
  .get(getClincs)
  .post(postClinc)
  .delete(deleteClinc);

router.post('/auth/signup', postSignup);

router.get('/clincs/:id', getClinc);

router.get('/offline-consultations', isAdminOrDoctor, getOfflineConsulations);

router.get('/online-consultations', isAdminOrDoctor, getOnlineConsultation);

export default router;
