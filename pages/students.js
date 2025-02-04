import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import StudentModal from "@/components/studentModal";
import EditStudentModal from "@/components/editStudentModal";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const router = useRouter();

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleView = (studentId) => {
    router.push(`/students/${studentId}`);
  };

  const handleEdit = (studentId) => {
    const student = students.find((student) => student.id === studentId);
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    try {
      await deleteDoc(doc(db, "students", studentId));
      setStudents(students.filter((student) => student.id !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleUpdateStudent = async (updatedStudent) => {
    try {
      const studentRef = doc(db, "students", updatedStudent.id);
      await updateDoc(studentRef, updatedStudent);
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-gray-400 text-black w-full lg:w-1/5 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black flex justify-center">
            Dashboard
          </h2>
          <ul className="flex flex-col gap-2 mt-4 p-2">
            <li>
              <Link href="/students">
                <button className="w-full text-left bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-black flex justify-center">
                  Students Page
                </button>
              </Link>
            </li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg mt-auto text-black"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Students List</h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus /> Add Student
          </button>
        </header>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-xs md:text-sm lg:text-base">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Class</th>
                <th className="border px-2 py-1">Section</th>
                <th className="border px-2 py-1">Roll Number</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 text-center text-black">
                    {student.id}
                  </td>
                  <td className="border px-2 py-1 text-center text-black">
                    {student.name}
                  </td>
                  <td className="border px-2 py-1 text-center text-black">
                    {student.class}
                  </td>
                  <td className="border px-2 py-1 text-center text-black">
                    {student.section}
                  </td>
                  <td className="border px-2 py-1 text-center text-black">
                    {student.rollNumber}
                  </td>
                  <td className="border px-2 py-1 text-center flex justify-center gap-2">
                    <Eye
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleView(student.id)}
                    />
                    <Edit
                      className="text-yellow-500 cursor-pointer"
                      onClick={() => handleEdit(student.id)}
                    />
                    <Trash2
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(student.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        {isModalOpen && (
          <StudentModal
            onClose={() => setIsModalOpen(false)}
            refreshStudents={fetchStudents}
          />
        )}
        {isEditModalOpen && selectedStudent && (
          <EditStudentModal
            onClose={() => setIsEditModalOpen(false)}
            student={selectedStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        )}
      </main>
    </div>
  );
}
