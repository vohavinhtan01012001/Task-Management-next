import http from "@/lib/http";
import { ApiResponse } from "@/schemaValidations/customDefinition";
import { taskType } from "@/schemaValidations/task.schema";

interface TaskApiResponse {
    tasks: taskType[];
}

interface TaskApiResponseCreate {
    task: taskType,
    status: ApiResponse
}

const taskApiRequest = {
    // getAll: (projectId: number) => http.get<TaskApiResponse>(`api/v1/task/${projectId}`),
    addTask: (task: any) => http.post<TaskApiResponseCreate>('api/v1/task/add-task', task),
    getTask: (sectionId:number) => http.get<TaskApiResponse>(`api/v1/task/get-task/${sectionId}`),
    updatePriority: (payload:any[]) => http.put<TaskApiResponse>(`api/v1/task/update-priority`,payload)
}

export default taskApiRequest;