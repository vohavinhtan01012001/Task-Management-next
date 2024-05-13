import http from "@/lib/http";
import { ApiResponse } from "@/schemaValidations/customDefinition";
import { sectionType } from "@/schemaValidations/section.schema";

interface SectionApiResponse {
    sections: sectionType[];
}

interface SectionApiResponseCreate {
    section: sectionType,
    status: ApiResponse
}

const sectionApiRequest = {
    getAll: (projectId: number) => http.get<SectionApiResponse>(`api/v1/section/${projectId}`),
    addSection: (section: any) => http.post<SectionApiResponseCreate>('api/v1/section/add-section', section),
    updatePriority: (payload:any[]) => http.put<SectionApiResponse>(`api/v1/section/update-priority`,payload)
}


export default sectionApiRequest;