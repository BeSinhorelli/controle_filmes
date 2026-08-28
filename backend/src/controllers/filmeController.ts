import { Request, Response } from 'express';
import { FilmeService } from '../services/filmeService';
import { validationResult } from 'express-validator';

const filmeService = new FilmeService();

export class FilmeController {
  async getAll(req: Request, res: Response) {
    try {
      const { busca, genero, status } = req.query;
      
      const filmes = await filmeService.findAll({
        busca: busca as string,
        genero: genero as string,
        status: status as string
      });
      
      res.json(filmes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const filme = await filmeService.findById(id);
      
      if (!filme) {
        return res.status(404).json({ error: 'Filme não encontrado' });
      }

      res.json(filme);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar filme' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const filme = await filmeService.create(req.body);
      res.status(201).json(filme);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar filme' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const filme = await filmeService.update(id, req.body);
      res.json(filme);
    } catch (error: any) {
      console.error(error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Filme não encontrado' });
      }
      
      res.status(500).json({ error: 'Erro ao atualizar filme' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      await filmeService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      console.error(error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Filme não encontrado' });
      }
      
      res.status(500).json({ error: 'Erro ao deletar filme' });
    }
  }
}