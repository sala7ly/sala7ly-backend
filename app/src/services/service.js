/**
 * Module for common CRUD operations on a Mongoose model.
 * @module modelUtils
 * @param {Model} model - The Mongoose model to perform operations on.
 *
 * @typedef {Object} ModelUtils
 * @property {Function} getAll - Retrieves multiple documents from the model based on filter criteria.
 * @property {Function} getOneById - Retrieves a single document by its unique identifier.
 * @property {Function} createOne - Creates a new document with the provided data.
 * @property {Function} updateOneById - Updates an existing document by its unique identifier.
 * @property {Function} deleteOneById - Deletes a document by its unique identifier.
 * @property {Function} count - Counts the number of documents that match the given filter criteria.
 * @property {Function} isExist - Checks if a document with the specified unique identifier exists.
 *
 * @returns {ModelUtils} An object containing common CRUD operations for the model.
 */
module.exports = (model) => {
    /**
     * Retrieves multiple documents from the model based on filter criteria.
     *
     * @function getAll
     * @async
     * @param {Object} options - Options for querying and filtering documents.
     * @param {Object} options.filter - The filter criteria for document retrieval.
     * @param {string} options.sortByFields - The fields to sort the retrieved documents by.
     * @param {string} options.selectedFields - The fields to select from the retrieved documents.
     * @param {number} options.page - The page number for pagination.
     * @param {number} options.pageLimit - The maximum number of documents to retrieve per page.
     * @param {string[]} options.populates - The fields to populate in the retrieved documents.
     * @returns {Promise<Array>} - A promise that resolves to an array of retrieved documents.
     * @example
     * const options = {
     *   filter: { status: 'active' },
     *   sortByFields: ['createdAt'],
     *   selectedFields: ['name', 'createdAt'],
     *   page: 1,
     *   pageLimit: 10,
     *   populates: ['author', 'comments'],
     * };
     * const documents = await modelUtils.getAll(options);
     */
    const getAll = async ({
        filter = {},
        sortByFields = '',
        selectedFields = '',
        page = 1,
        pageLimit = 100,
        populates = [],
    }) => {
        const startIndex = (page - 1) * pageLimit;

        const query = model
            .find(filter)
            .sort(`${sortByFields} _id`)
            .select(`${selectedFields} -__v`)
            .skip(startIndex)
            .limit(pageLimit);

        populates.forEach((item) => query.populate(item));

        const docs = await query;

        return docs;
    };

    /**
     * Retrieves a single document by its unique identifier.
     *
     * @function getOneById
     * @async
     * @param {string} id - The unique identifier of the document to retrieve.
     * @param {string[]} populates - The fields to populate in the retrieved document.
     * @returns {Promise<Object>} - A promise that resolves to the retrieved document.
     * @example
     * const documentId = 'exampleId123';
     * const document = await modelUtils.getOneById(documentId, ['author', 'comments']);
     */
    const getOneById = async (id, { populates = [] }) => {
        const query = model.findById(id);

        populates.forEach((item) => query.populate(item));

        const doc = await query;

        return doc;
    };

    /**
     * Creates a new document with the provided data.
     *
     * @function createOne
     * @async
     * @param {Object} docData - The data to create the document with.
     * @returns {Promise<Object>} - A promise that resolves to the newly created document.
     * @example
     * const newData = {
     *   name: 'John Doe',
     *   email: 'johndoe@example.com',
     * };
     * const newDocument = await modelUtils.createOne(newData);
     */
    const createOne = async (docData) => {
        const newDoc = await model.create(docData);

        if (newDoc) newDoc.__v = undefined;

        return newDoc;
    };

    /**
     * Updates an existing document by its unique identifier.
     *
     * @function updateOneById
     * @async
     * @param {string} id - The unique identifier of the document to update.
     * @param {Object} updatedFields - The fields to update in the document.
     * @returns {Promise<Object>} - A promise that resolves to the updated document.
     * @example
     * const documentId = 'exampleId123';
     * const updatedFields = {
     *   name: 'Updated Name',
     *   email: 'updated@example.com',
     * };
     * const updatedDocument = await modelUtils.updateOneById(documentId, updatedFields);
     */
    const updateOneById = async (id, udpatedFields = {}) => {
        const updatedDoc = await model.findOneAndUpdate(
            { _id: id },
            udpatedFields,
            {
                new: true,
                runValidators: true,
            }
        );

        if (updatedDoc) updatedDoc.__v = undefined;

        return updatedDoc;
    };

    /**
     * Deletes a document by its unique identifier.
     *
     * @function deleteOneById
     * @async
     * @param {string} id - The unique identifier of the document to delete.
     * @returns {Promise} - A promise indicating the success of the delete operation.
     * @example
     * const documentId = 'exampleId123';
     * await modelUtils.deleteOneById(documentId);
     */
    const deleteOneById = async (id) => {
        await model.deleteOne({ _id: id });

        return null;
    };

    /**
     * Counts the number of documents that match the given filter criteria.
     *
     * @function count
     * @async
     * @param {Object} filter - The filter criteria to apply to the count query.
     * @returns {Promise<number>} - A promise that resolves to the count of matching documents.
     * @example
     * const filterCriteria = { status: 'active' };
     * const documentCount = await modelUtils.count(filterCriteria);
     */
    const count = async (filter = {}) => {
        const cnt = await model.countDocuments(filter);

        return cnt;
    };

    /**
     * Checks if a document with the specified unique identifier exists.
     *
     * @function isExist
     * @async
     * @param {string} id - The unique identifier of the document to check.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating existence.
     * @example
     * const documentId = 'exampleId123';
     * const exists = await modelUtils.isExist(documentId);
     */
    const isExist = async (id) => {
        const doc = await model.findById(id);

        return !!doc;
    };

    return {
        getAll,
        getOneById,
        createOne,
        updateOneById,
        deleteOneById,
        count,
        isExist,
    };
};
