import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { UserContext } from "../context/UserContext";
import { apiurl } from './../api';
import axios from "axios";

export default function useQuizFlow() {
    const {user} = useContext(UserContext)
    const USER_ID = user?._id; // plug real auth later
    const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");

  // seed → get quiz → start attempt
  const bootstrap = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const seed = await axios.post(`${apiurl}/api/quiz/seed`);
      const quizId = seed.data.quizId;
      const q = await axios.get(`${apiurl}/api/quiz/${quizId}`);
      setQuiz(q.data);
      const a = await axios.post(`${apiurl}/api/attempt/start`, { userId: USER_ID, quizId });
      setAttempt(a.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const saveStep = useCallback(async (payload) => {
    if (!attempt?._id) throw new Error("Attempt not ready");
    await axios.post(`${apiurl}/api/attempt/${attempt._id}/step`, payload);
  }, [attempt]);

  const finish = useCallback(async () => {
    if (!attempt?._id) throw new Error("Attempt not ready");
    const fin = await axios.post(`${apiurl}/api/attempt/${attempt._id}/finish`);
    return fin.data; // finished attempt
  }, [attempt]);

  const stepCount = useMemo(() => quiz?.steps?.length ?? 0, [quiz]);

  return { loading, error, quiz, attempt, stepCount, saveStep, finish, refetch: bootstrap };
}
