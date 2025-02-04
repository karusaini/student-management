import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

const StudentDetail = () => {
  const router = useRouter();
  const { studentId } = router.query; // Get studentId from the URL
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!studentId) return; // Prevent the effect from running before studentId is available

    const fetchStudent = async () => {
      try {
        const studentDoc = await getDoc(doc(db, "students", studentId));
        if (studentDoc.exists()) {
          setStudent(studentDoc.data());
        } else {
          console.error("Student not found!");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (!student)
    return <div className="text-center py-6 text-xl">Loading...</div>;

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Student Details
        </h1>

        <div className="space-y-6">
          {/* Student ID and Roll Number */}
          <div className="flex justify-between items-center border-b pb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>ID:</strong> {student.id}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Roll Number:</strong> {student.rollNumber}
            </p>
          </div>

          {/* Student Name and Class */}
          <div className="flex justify-between items-center border-b pb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Name:</strong> {student.name}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Class:</strong> {student.class}
            </p>
          </div>

          {/* Student Section */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700">
              <strong>Section:</strong> {student.section}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push("/students")}
            className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none"
          >
            Back to Students
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
