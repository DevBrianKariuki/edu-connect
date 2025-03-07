
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

// Bus Interfaces
export interface Bus {
  id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  status: "active" | "maintenance" | "inactive";
  lastMaintenance: Date;
  assignedDriver?: string;
  createdAt: Date;
}

// Driver Interfaces
export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: "on duty" | "off duty";
  assignedBus?: string;
  assignedRoute?: string;
  createdAt: Date;
}

// Route Interfaces
export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  stops: number;
  assignedBus?: string;
  assignedDriver?: string;
  studentsCount: number;
  createdAt: Date;
}

// TransportStudent Interfaces
export interface TransportStudent {
  id: string;
  name: string;
  class: string;
  route: string;
  bus: string;
  pickupPoint: string;
  dropoffPoint: string;
  guardianContact: string;
  profilePic?: string;
  createdAt: Date;
}

// Bus CRUD Operations
export async function getBuses(): Promise<Bus[]> {
  try {
    const busesRef = collection(db, "buses");
    const q = query(busesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastMaintenance: doc.data().lastMaintenance?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Bus[];
  } catch (error) {
    console.error("Error getting buses:", error);
    return [];
  }
}

export async function addBus(busData: Omit<Bus, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const busesRef = collection(db, "buses");
    const docRef = await addDoc(busesRef, {
      ...busData,
      lastMaintenance: Timestamp.fromDate(busData.lastMaintenance),
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding bus:", error);
    return null;
  }
}

// Driver CRUD Operations
export async function getDrivers(): Promise<Driver[]> {
  try {
    const driversRef = collection(db, "drivers");
    const q = query(driversRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Driver[];
  } catch (error) {
    console.error("Error getting drivers:", error);
    return [];
  }
}

export async function addDriver(driverData: Omit<Driver, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const driversRef = collection(db, "drivers");
    const docRef = await addDoc(driversRef, {
      ...driverData,
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding driver:", error);
    return null;
  }
}

// Route CRUD Operations
export async function getRoutes(): Promise<Route[]> {
  try {
    const routesRef = collection(db, "routes");
    const q = query(routesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Route[];
  } catch (error) {
    console.error("Error getting routes:", error);
    return [];
  }
}

export async function addRoute(routeData: Omit<Route, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const routesRef = collection(db, "routes");
    const docRef = await addDoc(routesRef, {
      ...routeData,
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding route:", error);
    return null;
  }
}

// Transport Student CRUD Operations
export async function getTransportStudents(): Promise<TransportStudent[]> {
  try {
    const studentsRef = collection(db, "transportStudents");
    const q = query(studentsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as TransportStudent[];
  } catch (error) {
    console.error("Error getting transport students:", error);
    return [];
  }
}

export async function addTransportStudent(
  studentData: Omit<TransportStudent, 'id' | 'createdAt'>
): Promise<string | null> {
  try {
    const studentsRef = collection(db, "transportStudents");
    const docRef = await addDoc(studentsRef, {
      ...studentData,
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding transport student:", error);
    return null;
  }
}
