import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import EditStudentModal from "@/components/editStudentModal";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import StudentModal from "@/components/studentModal"; // Adjust the path if necessary

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudentView, setSelectedStudentView] = useState(null);
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
    const student = students.find((student) => student.id === studentId);
    setSelectedStudentView(student);
  };

  const handleEdit = (studentId) => {
    const student = students.find((student) => student.id === studentId);
    if (student) {
      setSelectedStudent(student); // Ensure selectedStudent is updated
      setIsEditModalOpen(true);
    }
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
      setSelectedStudent(null); // Reset the selected student
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const refreshStudents = () => {
    fetchStudents(); // Re-fetch the student list after adding
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-black text-black w-full lg:w-1/5 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black flex justify-center">
            Dashboard
          </h2>
          <ul className="flex flex-col gap-2 mt-4 p-2">
            <li>
              <Link href="/students">
                <button className="w-full text-left bg-white hover:bg-gray-200 px-4 py-2 rounded-lg text-black flex justify-center items-center font-bold">
                  Students Page
                </button>
              </Link>
            </li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white hover:bg-gray-200 px-4 py-2 rounded-lg mt-auto text-black font-bold"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 py-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Students List</h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-500 font-bold"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus /> Add Student
          </button>
        </header>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 text-xs md:text-sm lg:text-base">
            <thead>
              <tr className="bg-gray-300 text-black">
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

        {/* Edit Modal */}
        {isEditModalOpen && selectedStudent && (
          <EditStudentModal
            onClose={() => setIsEditModalOpen(false)}
            student={selectedStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {/* Add Student Modal */}
        {isModalOpen && (
          <StudentModal
            onClose={() => setIsModalOpen(false)}
            refreshStudents={refreshStudents} // Pass the refresh function
          />
        )}
        {selectedStudentView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
                Student Details
              </h2>

              {/* Two-column layout for student data */}
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(selectedStudentView).map((key) => (
                  <div key={key} className="flex flex-col">
                    <span className="font-medium text-gray-600 capitalize">
                      {key}:
                    </span>
                    <span className="text-gray-800">
                      {selectedStudentView[key]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 focus:outline-none"
                  onClick={() => setSelectedStudentView(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
