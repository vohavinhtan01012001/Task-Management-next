import http from "@/lib/http";
import { ApiResponse } from "@/schemaValidations/customDefinition";
import { projectAddType, projectType } from "@/schemaValidations/project.schema";
import { sectionType } from "@/schemaValidations/section.schema";

interface ProjectApiResponse {
  projects: projectType[];
}

interface ProjectApiResponseCreate {
  project:projectType,
  status: ApiResponse
}

interface ProjectApiResponseMove {
  list:projectType[],
  status: ApiResponse
}

const projectApiRequest = {
    getAll: () =>
      http.get<ProjectApiResponse>('api/v1/project'),
    addProject: (project: any) => 
      http.post<ProjectApiResponseCreate>('api/v1/project/add-project',project),
    getById: (id: number) => 
      http.get<{project: projectType}>('api/v1/project/get-project/' + id),
    updatePriority: (payload:any[]) => http.put<ProjectApiResponse>(`api/v1/project/update-priority`,payload),
    getAllListMove: () => http.get<ProjectApiResponseMove>(`api/v1/project/get/projects-sections`),
}


  export default projectApiRequest