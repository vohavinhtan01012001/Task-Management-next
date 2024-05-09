import http from "@/lib/http";
import { ApiResponse } from "@/schemaValidations/customDefinition";
import { projectAddType, projectType } from "@/schemaValidations/project.schema";

interface ProjectApiResponse {
  projects: projectType[];
}

interface ProjectApiResponseCreate {
  project:projectType,
  status: ApiResponse
}

const projectApiRequest = {
    getAll: () =>
      http.get<ProjectApiResponse>('api/v1/project'),
    addProject: (project: any) => 
      http.post<ProjectApiResponseCreate>('api/v1/project/add-project',project),
    getById: (id: number) => 
      http.get<{project: projectType}>('api/v1/project/get-project/' + id),
}


  export default projectApiRequest