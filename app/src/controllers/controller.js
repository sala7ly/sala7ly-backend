/**
 * Controller Module
 * @module controller
 * @param {Object} service - The service object containing methods for database operations.
 * @param {Object} utils - Utility functions and classes for handling errors and asynchronous operations.
 * @param {string} [modelName='document'] - The name of the model for which the controller handles operations.
 *
 * @typedef {Object} Controller
 * @property {Function} getAll - A function for retrieving multiple documents based on filter criteria.
 * @property {Function} getOneById - A function for retrieving a single document by its unique identifier.
 * @property {Function} createOne - A function for creating a new document.
 * @property {Function} updateOneById - A function for updating an existing document by its unique identifier.
 * @property {Function} deleteOneById - A function for deleting a document by its unique identifier.
 *
 * @returns {Controller} An object containing controller methods for handling HTTP requests.
 * @see {@link module:service} For methods provided by the service object.
 * @see {@link module:utils} For utility functions and classes.
 */
module.exports = (service, utils, modelName = 'document') => {
    const { catchAsync, StandardJsonResponse, AppError, APIFeatures } = utils;

    /**
     * Retrieves multiple documents based on filter criteria.
     *
     * @function getAll
     * @async
     * @param {Object} options - Options for querying and filtering documents.
     * @param {Object} options.filter - The filter criteria for document retrieval.
     * @param {string[]} options.sortByFields - The fields to sort the retrieved documents by.
     * @param {string[]} options.selectedFields - The fields to select from the retrieved documents.
     * @param {number} options.page - The page number for pagination.
     * @param {number} options.pageLimit - The maximum number of documents to retrieve per page.
     * @param {string[]} options.populates - The fields to populate in the retrieved documents.
     * @returns {Promise<StandardJsonResponse>} A promise that resolves to a standard JSON response containing the retrieved documents.
     * @throws {AppError} If an error occurs during retrieval or parsing of query parameters.
     * @example
     * const options = {
     *   filter: { status: 'active' },
     *   sortByFields: ['createdAt'],
     *   selectedFields: ['name', 'createdAt'],
     *   page: 1,
     *   pageLimit: 10,
     *   populates: ['author', 'comments'],
     * };
     * const response = await controller.getAll(options);
     */
    const getAll = ({
        filter = {},
        sortByFields = '',
        selectedFields = '',
        page = 1,
        pageLimit = 100,
        populates = [],
    }) =>
        catchAsync(async (req, res, next) => {
            // Parse query string
            if (req.query) {
                const apiFeatures = new APIFeatures(req.query);

                // Parse query string
                filter = apiFeatures.parseFilterOptions() || filter;
                sortByFields = apiFeatures.parseSortOptions() || sortByFields;
                selectedFields =
                    apiFeatures.parseSelectOptions() || sortByFields;
                page = +(req.query.page || page);
                pageLimit = +(req.query.limit || pageLimit);
            }

            // Retrieve Documents
            const docs = await service.getAll({
                filter,
                sortByFields,
                selectedFields,
                page,
                pageLimit,
                populates,
            });

            // Count number of documents
            const count = await service.count(filter);

            // Create Pagination Object
            const pagination = APIFeatures.createPaginationObject(
                page,
                pageLimit,
                count
            );

            // Send successful response to client
            return new StandardJsonResponse(res, 200)
                .setMainContent(true, `${modelName}s retrieved successfully`)
                .setSuccessPayload({
                    count: docs.length,
                    data: docs,
                    pagination,
                })
                .send();
        });

    /**
     * Retrieves a single document by its unique identifier.
     *
     * @function getOneById
     * @async
     * @param {Object} options - Options for populating fields in the retrieved document.
     * @param {string[]} options.populates - The fields to populate in the retrieved document.
     * @returns {Promise<StandardJsonResponse>} A promise that resolves to a standard JSON response containing the retrieved document.
     * @throws {AppError} If the document is not found or an error occurs during retrieval.
     * @example
     * const id = '123456';
     * const options = {
     *   populates: ['author', 'comments'],
     * };
     * const response = await controller.getOneById(options);
     */
    const getOneById = ({ populates = [] }) =>
        catchAsync(async (req, res, next) => {
            // Extract id from request paramaters
            const { id } = req.params;
            // Retrieve document using service
            const doc = await service.getOneById(id, { populates });

            // Check if document is retrieved
            if (!doc) {
                return next(
                    new AppError(`No ${modelName} found with that ID`, 404)
                );
            }

            // Send successful response to client
            return new StandardJsonResponse(res, 200)
                .setMainContent(true, `${modelName} retrieved successfully`)
                .setSuccessPayload({
                    data: doc,
                })
                .send();
        });

    /**
     * Creates a new document in the database.
     *
     * @function createOne
     * @async
     * @returns {Promise<StandardJsonResponse>} A promise that resolves to a standard JSON response containing the newly created document.
     * @throws {AppError} If an error occurs during document creation or validation.
     * @example
     * const response = await controller.createOne();
     */
    const createOne = () =>
        catchAsync(async (req, res, next) => {
            // Create new document using service
            const newDoc = await service.createOne(req.body);

            // Check if document is created
            if (!newDoc) {
                return next(
                    new AppError(`No ${modelName} found with that ID`, 404)
                );
            }

            // Send successful response to client
            return new StandardJsonResponse(res, 201)
                .setMainContent(true, `${modelName} created successfully`)
                .setSuccessPayload({
                    data: newDoc,
                })
                .send();
        });

    /**
     * Updates an existing document by its unique identifier.
     *
     * @function updateOneById
     * @async
     * @returns {Promise<StandardJsonResponse>} A promise that resolves to a standard JSON response containing the updated document.
     * @throws {AppError} If the document is not found, or an error occurs during document update or validation.
     * @example
     * const response = await controller.updateOneById();
     */
    const updateOneById = () =>
        catchAsync(async (req, res, next) => {
            // Extract id from request paramaters
            const { id } = req.params;

            // Check if document is exist
            const isExist = await service.isExist(id);

            if (!isExist) {
                return next(
                    new AppError(`No ${modelName} found with that ID`, 404)
                );
            }

            // Update document with using service
            const newDoc = await service.updateOneById(id, req.body);

            // Check if document is updated
            if (!newDoc) {
                return next(
                    new AppError(
                        `${modelName} with ID ${id} could not be updated. Please try again.`,
                        409
                    )
                );
            }

            // Send successful response to client
            return new StandardJsonResponse(res, 200)
                .setMainContent(true, `${modelName} updated successfully`)
                .setSuccessPayload({
                    data: newDoc,
                })
                .send();
        });

    /**
     * Deletes a document by its unique identifier.
     *
     * @function deleteOneById
     * @async
     * @returns {Promise<StandardJsonResponse>} A promise that resolves to a standard JSON response indicating the result of the deletion operation.
     * @throws {AppError} If the document is not found, or an error occurs during document deletion.
     * @example
     * const response = await controller.deleteOneById();
     */
    const deleteOneById = () =>
        catchAsync(async (req, res, next) => {
            // Extract id from request paramaters
            const { id } = req.params;

            // Check if document is exist
            const isExist = await service.isExist(id);

            if (!isExist) {
                return next(
                    new AppError(`No ${modelName} found with that ID`, 404)
                );
            }

            // Delete document with using service
            const doc = await service.deleteOneById(id);

            // Check if document is deleted
            if (doc != null) {
                return next(
                    new AppError(
                        `${modelName} with ID ${id} could not be deleted. Please try again.`,
                        409
                    )
                );
            }

            // Send successful response to client
            return new StandardJsonResponse(res, 200)
                .setMainContent(true, `${modelName} deleted successfully`)
                .setSuccessPayload({
                    data: null,
                })
                .send();
        });

    return {
        getAll,
        getOneById,
        createOne,
        updateOneById,
        deleteOneById,
    };
};
