
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "./config";

export interface ClassData {
  id: string;
  name: string;
  capacity: number;
  teacher: string;
  teacherId: string;
  students?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CLASSES_COLLECTION = "classes";

export async function createClass(data: Omit<ClassData, "id" | "createdAt" | "updatedAt" | "students">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CLASSES_COLLECTION), {
      ...data,
      students: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating class:", error);
    throw new Error("Failed to create class");
  }
}

export async function updateClass(id: string, data: Partial<Omit<ClassData, "id" | "createdAt" | "updatedAt">>): Promise<void> {
  try {
    const classRef = doc(db, CLASSES_COLLECTION, id);
    await updateDoc(classRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating class:", error);
    throw new Error("Failed to update class");
  }
}

export async function deleteClass(id: string): Promise<void> {
  try {
    // First check if there are any students in this class
    const studentsQuery = query(collection(db, "students"), where("class", "==", id));
    const studentsSnapshot = await getDocs(studentsQuery);
    
    if (!studentsSnapshot.empty) {
      throw new Error("Cannot delete class with enrolled students");
    }
    
    await deleteDoc(doc(db, CLASSES_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
}

export async function getClassById(id: string): Promise<ClassData> {
  try {
    const classDoc = await getDoc(doc(db, CLASSES_COLLECTION, id));
    if (!classDoc.exists()) {
      throw new Error("Class not found");
    }
    
    const data = classDoc.data();
    return {
      id: classDoc.id,
      name: data.name,
      capacity: data.capacity,
      teacher: data.teacher,
      teacherId: data.teacherId || "",
      students: data.students || 0,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error("Error getting class:", error);
    throw new Error("Failed to get class");
  }
}

export async function getAllClasses(): Promise<ClassData[]> {
  try {
    const querySnapshot = await getDocs(collection(db, CLASSES_COLLECTION));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        capacity: data.capacity,
        teacher: data.teacher,
        teacherId: data.teacherId || "",
        students: data.students || 0,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    });
  } catch (error) {
    console.error("Error getting classes:", error);
    throw new Error("Failed to get classes");
  }
}
