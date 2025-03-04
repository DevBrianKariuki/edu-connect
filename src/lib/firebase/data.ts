
import { collection, getDocs, query, where, getCountFromServer, DocumentData, Query, CollectionReference } from "firebase/firestore";
import { db } from "./config";

// Function to get total count of documents in a collection
export async function getCollectionCount(collectionName: string, filterField?: string, filterValue?: any): Promise<number> {
  try {
    let q: Query<DocumentData>;
    
    if (filterField && filterValue !== undefined) {
      q = query(collection(db, collectionName), where(filterField, "==", filterValue));
    } else {
      q = collection(db, collectionName);
    }
    
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error(`Error getting count for ${collectionName}:`, error);
    return 0;
  }
}

// Function to get recent activities
export async function getRecentActivities(limit: number = 5): Promise<any[]> {
  try {
    const activitiesRef = collection(db, "activities");
    const snapshot = await getDocs(query(activitiesRef));
    
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
    
    // Sort by timestamp in descending order
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  } catch (error) {
    console.error("Error getting recent activities:", error);
    return [];
  }
}

// Function to get upcoming events
export async function getUpcomingEvents(limit: number = 3): Promise<any[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(query(eventsRef));
    
    const events = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      }))
      .filter(event => event.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, limit);
      
    return events;
  } catch (error) {
    console.error("Error getting upcoming events:", error);
    return [];
  }
}

// Function to get student academic progress
export async function getStudentProgress(studentId: string): Promise<any[]> {
  try {
    const progressRef = collection(db, "academic_progress");
    const q = query(progressRef, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting student progress:", error);
    return [];
  }
}

// Define an interface for schedule items to ensure type safety
interface ScheduleItem {
  id: string;
  startTime?: string;
  endTime?: string;
  className?: string;
  subject?: string;
  room?: string;
  time?: string;
  class?: string;
  [key: string]: any; // Allow for additional properties
}

// Function to get teacher's schedule for today
export async function getTeacherSchedule(teacherId: string): Promise<ScheduleItem[]> {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const scheduleRef = collection(db, "schedules");
    const q = query(scheduleRef, where("teacherId", "==", teacherId), where("dayOfWeek", "==", dayOfWeek));
    const snapshot = await getDocs(q);
    
    // Parse the documents and ensure each item has the required properties
    const scheduleItems: ScheduleItem[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return scheduleItems.sort((a, b) => {
      // Check if startTime exists before using it
      if (a.startTime && b.startTime) {
        const timeA = a.startTime.split(":").map(Number);
        const timeB = b.startTime.split(":").map(Number);
        
        if (timeA[0] !== timeB[0]) {
          return timeA[0] - timeB[0];
        }
        return timeA[1] - timeB[1];
      }
      return 0; // Default case if startTime is missing
    });
  } catch (error) {
    console.error("Error getting teacher schedule:", error);
    return [];
  }
}
