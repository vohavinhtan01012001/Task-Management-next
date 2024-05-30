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
    updatePriority: (payload:any[]) => http.put<SectionApiResponse>(`api/v1/section/update-priority`,payload),
    updateSection: (id:number,section: any) => http.put<ApiResponse>(`api/v1/section/update-section/${id}`,section),
    deleteSection: (id:number) => http.delete<ApiResponse>(`api/v1/section/delete/${id}`),
    copySection: (id:number) => http.get<ApiResponse>(`api/v1/section/copy/${id}`),
}


export default sectionApiRequest;