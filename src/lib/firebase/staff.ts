
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "./config";

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: Date;
  status: "active" | "inactive";
  profilePhotoUrl?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string | Date; // Can be either string or Date depending on source
  status: "active" | "inactive";
  profilePhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const STAFF_COLLECTION = "staff";

export async function addStaffMember(data: StaffFormData): Promise<string> {
  try {
    // Ensure joinDate is converted to string if it's a Date object
    const staffData = {
      ...data,
      // Convert Date to ISO string format for storage
      joinDate: data.joinDate instanceof Date ? data.joinDate.toISOString().split('T')[0] : data.joinDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, STAFF_COLLECTION), staffData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding staff member:", error);
    throw new Error("Failed to add staff member");
  }
}

export async function updateStaffMember(id: string, data: Partial<StaffFormData>): Promise<void> {
  try {
    const staffRef = doc(db, STAFF_COLLECTION, id);
    
    // Prepare update data - handle Date conversion for joinDate if present
    const updatedData = {
      ...data,
      // Only convert joinDate if it exists and is a Date
      ...(data.joinDate && { 
        joinDate: data.joinDate instanceof Date ? data.joinDate.toISOString().split('T')[0] : data.joinDate 
      }),
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(staffRef, updatedData);
  } catch (error) {
    console.error("Error updating staff member:", error);
    throw new Error("Failed to update staff member");
  }
}

export async function deleteStaffMember(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, STAFF_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting staff member:", error);
    throw new Error("Failed to delete staff member");
  }
}

export async function getAllStaffMembers(): Promise<StaffMember[]> {
  try {
    const querySnapshot = await getDocs(collection(db, STAFF_COLLECTION));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        role: data.role,
        joinDate: data.joinDate, // Keep as string from Firestore
        status: data.status as "active" | "inactive",
        profilePhotoUrl: data.profilePhotoUrl || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error("Error getting staff members:", error);
    throw new Error("Failed to get staff members");
  }
}

export async function getStaffMembersByDepartment(department: string): Promise<StaffMember[]> {
  try {
    const q = query(collection(db, STAFF_COLLECTION), where("department", "==", department));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        role: data.role,
        joinDate: data.joinDate,
        status: data.status as "active" | "inactive",
        profilePhotoUrl: data.profilePhotoUrl || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error("Error getting staff by department:", error);
    throw new Error("Failed to get staff by department");
  }
}

export async function getTeachers(): Promise<StaffMember[]> {
  try {
    const q = query(
      collection(db, STAFF_COLLECTION), 
      where("role", "in", ["Teacher", "Head of Department"])
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        role: data.role,
        joinDate: data.joinDate,
        status: data.status as "active" | "inactive",
        profilePhotoUrl: data.profilePhotoUrl || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error("Error getting teachers:", error);
    throw new Error("Failed to get teachers");
  }
}

export async function getActiveStaffCount(): Promise<number> {
  try {
    const q = query(collection(db, STAFF_COLLECTION), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting active staff count:", error);
    return 0;
  }
}

export async function getStaffCountByDepartment(): Promise<Record<string, number>> {
  try {
    const querySnapshot = await getDocs(collection(db, STAFF_COLLECTION));
    const counts: Record<string, number> = {};
    
    querySnapshot.docs.forEach(doc => {
      const department = doc.data().department;
      if (department) {
        counts[department] = (counts[department] || 0) + 1;
      }
    });
    
    return counts;
  } catch (error) {
    console.error("Error getting staff counts by department:", error);
    return {};
  }
}
