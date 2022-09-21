const express = require('express');
const Joi = require('joi');
const visitors = require('../../models/visitors');

const router = express.Router();

const visitorSchema = Joi.object({
  firstName: Joi.string().required(),
  secondName: Joi.string().required(),
  entryMoment: Joi.string(),
});

router.get('/', async (_, res, next) => {
  try {
    const result = await visitors.getAll();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await visitors.getById(id);
    if (!result) {
      throw RequestError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = visitorSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const result = await visitors.add(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = visitorSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const { id } = req.params;
    const result = await visitors.updateById(id, req.body);
    if (!result) {
      throw RequestError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await visitors.removeById(id);
    if (!result) {
      throw RequestError(404, 'Not found');
    }
    res.json({
      message: 'Visitor deleted',
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    if (!body) {
      res.status(400).json({ message: 'missing fields' });
      return;
    }
    const visitor = await updateVisitor(id, body);
    if (!visitor) {
      res.status(404).json({ message: 'not found' });
      return;
    }
    res.status(200).json({ message: 'Visitor was updated to:', visitor });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
