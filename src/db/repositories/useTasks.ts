import { useCallback } from 'react';
import { useRealm, useQuery } from '@/db/realmConfig';
import { Task } from '@/db/schemas';
import { v4 as uuidv4 } from 'uuid';
import { scheduleTaskNotification, cancelTaskNotification } from '@/services/notifications';

export function useTasks() {
  const realm = useRealm();
  
  // Sort tasks by dateTime ascending
  const tasks = useQuery(Task).sorted('dateTime');

  const addTask = useCallback(async (title: string, dateTime: Date) => {
    const notificationId = await scheduleTaskNotification(title, dateTime);

    realm.write(() => {
      realm.create(Task.schema.name, {
        id: uuidv4(),
        title,
        dateTime,
        notificationId: notificationId || undefined,
        notified: false,
        done: false,
      });
    });
  }, [realm]);

  const toggleTaskDone = useCallback(async (id: string) => {
    const task = realm.objectForPrimaryKey<Task>(Task.schema.name, id);
    if (task) {
      const newDoneState = !task.done;
      if (newDoneState && task.notificationId) {
        await cancelTaskNotification(task.notificationId);
      }

      realm.write(() => {
        task.done = newDoneState;
      });
    }
  }, [realm]);

  const deleteTask = useCallback(async (id: string) => {
    const task = realm.objectForPrimaryKey<Task>(Task.schema.name, id);
    if (task) {
      if (task.notificationId) {
        await cancelTaskNotification(task.notificationId);
      }
      realm.write(() => {
        realm.delete(task);
      });
    }
  }, [realm]);

  return {
    tasks,
    addTask,
    toggleTaskDone,
    deleteTask,
  };
}
