import http from "@/lib/http";
import { projectType } from "@/schemaValidations/project.schema";

interface ProjectApiResponse {
  projects: projectType[];
}

const projectApiRequest = {
    getAll: () =>
      http.get<ProjectApiResponse>('api/v1/project'),
}


  export default projectApiRequest