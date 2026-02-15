import Joi from "joi";

export const addReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().required(),
  cookId: Joi.string().required(),
});

export const getReviewsSchema = Joi.object({
  cookId: Joi.string().required(),
  count: Joi.string().optional()
});

export const getReviewSchema = Joi.object({
  cookId: Joi.string().required(),
  reviewId: Joi.string().required(),
});

export const updateReviewSchema = Joi.object({
  reviewId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().optional(),
});

export const deleteReviewSchema = Joi.object({
  reviewId: Joi.string().required(),
  cookId: Joi.string().optional(),
});

export const countReviewSchema = Joi.object({
  cookId: Joi.string().required(),
});

export const countRatingSchema = Joi.object({
  cookId: Joi.string().required(),
});