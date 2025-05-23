package handlers

import (
	"net/http"
)

func (handle *Handle) FolderStructureHandler(w http.ResponseWriter, r *http.Request) {
    if !requireMethod(w, r, http.MethodGet) {
		return
	}

	data := handle.DM.ParentData
	writeJSON(w, http.StatusOK, data)
}


func (handle *Handle) getJobs(w http.ResponseWriter, r *http.Request) {
    if !requireMethod(w, r, http.MethodGet) {
		return
	}

	jobNames := handle.DM.GetParentDataAllJobs()
	result := map[string]interface{}{
		"total_jobs": len(jobNames),
		"job_names":  jobNames,
	}
	writeJSON(w, http.StatusOK, result)
}


func (handle *Handle) getDatasets(w http.ResponseWriter, r *http.Request) {
    if !requireMethod(w, r, http.MethodGet) {
		return
	}

	jobName := r.URL.Query().Get("job")
	if jobName == "" {
		http.Error(w, "Missing job parameter", http.StatusBadRequest)
		return
	}
	if !handle.DM.JobExists(jobName) {
		http.Error(w, "Job not found", http.StatusNotFound)
		return
	}
 
	datasetNames := handle.DM.GetParentDataAllDatasets(jobName)
	result := map[string]interface{}{
		"total_datasets": len(datasetNames),
		"dataset_names":  datasetNames,
	}
	writeJSON(w, http.StatusOK, result)
}


func (handle *Handle) getImages(w http.ResponseWriter, r *http.Request) {
    if !requireMethod(w, r, http.MethodGet) {
		return
	}

	jobName := r.URL.Query().Get("job")
	datasetName := r.URL.Query().Get("dataset")
	if jobName == "" || datasetName == "" {
		http.Error(w, "Missing job or dataset parameter", http.StatusBadRequest)
		return
	}
	if !handle.DM.JobExists(jobName) {
		http.Error(w, "Job not found", http.StatusNotFound)
		return
	}

	images := handle.DM.GetParentDataAllImages(jobName, datasetName)
	writeJSON(w, http.StatusOK, images)
}
