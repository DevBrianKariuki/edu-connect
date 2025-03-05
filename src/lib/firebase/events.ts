
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  Timestamp,
  orderBy
} from "firebase/firestore";
import { db } from "./config";

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  createdBy?: string;
  createdAt: Date;
}

export async function getEvents(): Promise<Event[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("date"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Event[];
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
}

export async function getUpcomingEvents(limit: number = 3): Promise<Event[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef, 
      where("date", ">=", today),
      orderBy("date")
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }))
      .slice(0, limit) as Event[];
  } catch (error) {
    console.error("Error getting upcoming events:", error);
    return [];
  }
}

export async function addEvent(eventData: Omit<Event, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const eventsRef = collection(db, "events");
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      date: Timestamp.fromDate(eventData.date),
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    return null;
  }
}

export async function updateEvent(id: string, eventData: Partial<Omit<Event, 'id' | 'createdAt'>>): Promise<boolean> {
  try {
    const eventRef = doc(db, "events", id);
    const data: any = { ...eventData };
    
    if (eventData.date) {
      data.date = Timestamp.fromDate(eventData.date);
    }
    
    await updateDoc(eventRef, data);
    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    return false;
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    const eventRef = doc(db, "events", id);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}
