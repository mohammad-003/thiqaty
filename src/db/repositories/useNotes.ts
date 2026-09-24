import { useCallback } from 'react';
import { useRealm, useQuery } from '@/db/realmConfig';
import { Note, NoteCategory, Attachment } from '@/db/schemas';
import { v4 as uuidv4 } from 'uuid';

export function useNotes() {
  const realm = useRealm();
  
  // Sort by createdAt descending
  const notes = useQuery(Note).sorted('createdAt', true);
  const attachments = useQuery(Attachment);

  const addNote = useCallback((title: string, body: string, category: NoteCategory) => {
    realm.write(() => {
      realm.create(Note.schema.name, {
        id: uuidv4(),
        title,
        body,
        category,
        createdAt: new Date(),
      });
    });
  }, [realm]);

  const updateNote = useCallback((id: string, title: string, body: string, category: NoteCategory) => {
    const note = realm.objectForPrimaryKey<Note>(Note.schema.name, id);
    if (note) {
      realm.write(() => {
        note.title = title;
        note.body = body;
        note.category = category;
      });
    }
  }, [realm]);

  const deleteNote = useCallback((id: string) => {
    const note = realm.objectForPrimaryKey<Note>(Note.schema.name, id);
    if (note) {
      realm.write(() => {
        // Also delete linked attachments
        const linkedAttachments = realm.objects(Attachment.schema.name).filtered('linkedToId == $0', id);
        realm.delete(linkedAttachments);
        realm.delete(note);
      });
    }
  }, [realm]);

  const addAttachment = useCallback((linkedToId: string, fileName: string, mimeType: string, encryptedFilePath: string, sizeBytes: number) => {
    realm.write(() => {
      realm.create(Attachment.schema.name, {
        id: uuidv4(),
        fileName,
        mimeType,
        encryptedFilePath,
        sizeBytes,
        linkedToId,
        addedAt: new Date(),
      });
    });
  }, [realm]);

  const deleteAttachment = useCallback((id: string) => {
    const att = realm.objectForPrimaryKey<Attachment>(Attachment.schema.name, id);
    if (att) {
      realm.write(() => {
        realm.delete(att);
      });
    }
  }, [realm]);

  return {
    notes,
    attachments,
    addNote,
    updateNote,
    deleteNote,
    addAttachment,
    deleteAttachment,
  };
}
