import { Router } from 'express';
import { FilmeController } from '../controllers/filmeController';
import { body } from 'express-validator';

const router = Router();
const controller = new FilmeController();

// Validações
const validateFilme = [
  body('titulo').notEmpty().withMessage('Título é obrigatório'),
  body('diretor').notEmpty().withMessage('Diretor é obrigatório'),
  body('genero').notEmpty().withMessage('Gênero é obrigatório'),
  body('ano').isInt({ min: 1888, max: 2100 }).withMessage('Ano inválido'),
  body('nota').isFloat({ min: 0, max: 10 }).withMessage('Nota deve ser entre 0 e 10'),
  body('status').isIn(['QUERO_ASSISTIR', 'ASSISTINDO', 'ASSISTIDO']).withMessage('Status inválido'),
  body('sinopse').notEmpty().withMessage('Sinopse é obrigatória')
];

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateFilme, controller.create);
router.put('/:id', validateFilme, controller.update);
router.delete('/:id', controller.delete);

export default router;