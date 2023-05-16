const { Router } = require('express')
const {
  getAllPoints,
  getAllPointsByClient,
  postPoints,
  putPoints,
  deletePoints,
  resetPoints
} = require('../controllers/points')
const {
  getAllPointsValidation,
  getAllPointsByClientValidation,
  postPointsValidation,
  putPointsValidation,
  deletePointsValidation,
  resetPointsValidation
} = require('../validations/points-validator')

const router = Router()

/**
 * {{url}}/api/points
 */

router.get('/', getAllPointsValidation, getAllPoints)

router.get('/client/:id', getAllPointsByClientValidation, getAllPointsByClient)
router.post('/', postPointsValidation, postPoints)
router.put('/:id', putPointsValidation, putPoints)
router.delete('/:id', deletePointsValidation, deletePoints)

router.post('/reset', resetPointsValidation, resetPoints)

module.exports = router
