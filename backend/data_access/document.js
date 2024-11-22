import { Document } from '../models/Document.js';

const saveDocumentDb = (document) => new Document(document).save();

const addCollaboratorToDocumentDb = (documentId, collaboratorId) =>
  Document.findByIdAndUpdate(documentId, {
    $push: { collaborators: collaboratorId }
  });

const findDocumentByIdDb = (documentId) => Document.findById(documentId);

export {
  saveDocumentDb,
  addCollaboratorToDocumentDb,
  findDocumentByIdDb
};