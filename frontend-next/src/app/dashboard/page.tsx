"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import API_BASE_URL from '@/config';
import { Toast, ToastType } from '@/components/ui/Toast';

interface Teacher {
    allocation_id: number;
    teacher_name: string;
}

interface Subject {
    subject_code: string;
    teachers: Teacher[];
}

export default function DashboardPage() {
    const router = useRouter();
    const [teachers, setTeachers] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
        msg: '',
        type: 'info',
        visible: false,
    });

    const showToast = (msg: string, type: ToastType) => {
        setToast({ msg, type, visible: true });
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            // Need credentials: 'include' for session based auth if backend needs cookies
            const res = await fetch(`${API_BASE_URL}/my-teachers/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (data.status === "ok") {
                setTeachers(data.subjects);
            } else {
                showToast("Session expired or invalid. Please login again.", "error");
                // setTimeout(() => router.push('/'), 2000); 
                // Don't auto-redirect immediately so they see the error, maybe? 
                // Old code redirected immediately.
                router.push('/');
            }
        } catch (error) {
            console.error("Fetch teachers error:", error);
            showToast("Error connecting to server. Is backend running?", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleGiveFeedback = (subjectCode: string, allocationId: number, teacherName: string) => {
        // Navigate to feedback page with params
        // Can use query params or dynamic route. 
        // Dynamic route /dashboard/feedback/[allocationId]?subject=...&name=... is cleaner.
        const params = new URLSearchParams({
            subjectCode,
            teacherName
        });
        router.push(`/dashboard/feedback/${allocationId}?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
                <p>Loading your assigned teachers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Toast
                message={toast.msg}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-800">My Teachers</h2>
                <p className="text-gray-500">Select a teacher below to provide your feedback.</p>
            </div>

            {teachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">No Teachers Found</h3>
                    <p className="text-gray-500 max-w-sm mt-2">
                        It looks like no teachers are assigned to you yet. Please contact your administrator.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {teachers.map((subject, idx) => (
                        <motion.div
                            key={subject.subject_code}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group flex flex-col"
                        >
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-none">{subject.subject_code}</h3>
                                        <p className="text-white/70 text-xs mt-1">Course Code</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-2">
                                <div className="divide-y divide-gray-50">
                                    {subject.teachers.map((teacher) => (
                                        <div key={teacher.allocation_id} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                                                    {teacher.teacher_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-tight">{teacher.teacher_name}</p>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-0.5">Academic Faculty</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleGiveFeedback(subject.subject_code, teacher.allocation_id, teacher.teacher_name)}
                                                className="group/btn relative px-4 py-2 text-sm font-bold text-blue-600 hover:text-white transition-colors overflow-hidden rounded-lg border border-blue-100 hover:border-blue-600"
                                            >
                                                <span className="relative z-10 flex items-center gap-1.5">
                                                    Feedback
                                                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </span>
                                                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-200" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
