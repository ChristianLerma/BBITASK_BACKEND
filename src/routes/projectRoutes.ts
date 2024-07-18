import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputError } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { ProjectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, TaskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'

const router = Router()

router.use(authenticate)

/**Route for Projects */
router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del Proyecto es Obligatoria'),
    handleInputError,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('Id no Válido'),
    handleInputError,
    ProjectController.getProjectById)

router.put('/:id', 
    param('id').isMongoId().withMessage('Id no Válido'),
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del Proyecto es Obligatoria'),
    handleInputError,
    ProjectController.updateProject)

router.delete('/:id', 
    param('id').isMongoId().withMessage('Id no Válido'),
    handleInputError,
    ProjectController.deleteProjectById)
/**Route for Projects */

/**Route for Tasks */
router.param('projectId', ProjectExists)

router.post('/:projectId/tasks', 
    hasAuthorization, 
    body('name')
    .notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
    body('description')
    .notEmpty().withMessage('La Descripción de la Tarea es Obligatoria'),
    handleInputError,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', TaskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no Válido'),
    handleInputError,
    TaskController.getTasksById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization, 
    param('taskId').isMongoId().withMessage('Id no Válido'),
    body('name')
    .notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
    body('description')
    .notEmpty().withMessage('La Descripción de la Tarea es Obligatoria'),
    handleInputError,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization, 
    param('taskId').isMongoId().withMessage('Id no Válido'),
    handleInputError,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Id no Válido'),
    body('status')
        .notEmpty().withMessage('El Estado es Obligatorio'),
    handleInputError,
    TaskController.updateStatus
)
/**Route for Tasks */

/**Route for Teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Email no válido'),
    handleInputError,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID no válido'),
    handleInputError,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no válido'),
    handleInputError,
    TeamMemberController.removeMemberById
)

export default router