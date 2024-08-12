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
interface TaskApiResponseCreateComment {
    comments: any,
    status: ApiResponse
}

const taskApiRequest = {
    // getAll: (projectId: number) => http.get<TaskApiResponse>(`api/v1/task/${projectId}`),
    addTask: (task: any) => http.post<TaskApiResponseCreate>('api/v1/task/add-task', task),
    addSubTask: (id:number,task: any) => http.post<TaskApiResponseCreate>(`api/v1/task/add-subTask/${id}`, task),
    getTask: (sectionId:number) => http.get<TaskApiResponse>(`api/v1/task/get-task/${sectionId}`),
    getSubTasks: (id:number) => http.get<TaskApiResponse>(`api/v1/task/get-subTask/${id}`),
    updatePriority: (payload:any[]) => http.put<TaskApiResponse>(`api/v1/task/update-priority`,payload),
    updateStatus: (id:number) => http.get<ApiResponse>(`api/v1/task/update-status/${id}`),
    updateTask: (id:number,payload:any) => http.patch<TaskApiResponseCreate>(`api/v1/task/update/${id}`,payload),
    moveTaskToSection: (taskId:number,sectionId:number) => http.patch(`api/v1/task/move-task/${taskId}`,{sectionId:sectionId}),
    addComment: (comment: any) => http.post<TaskApiResponseCreateComment>('api/v1/comment/add-comment', comment),
    getComments: (id:number) => http.get<any>(`api/v1/comment/get-comment/${id}`),
}

export default taskApiRequest;