package handlers

import (
    "bytes"
    "encoding/base64"
    "image"
    "log"
    "os"
    "net/http"

    "github.com/nfnt/resize"
    "github.com/chai2010/webp"
    _ "image/jpeg"
    _ "image/png"
    _ "image/gif"
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

    cachedImages, exists := handle.DM.GetImagesCache(jobName, datasetName)
    if  exists {
        writeJSON(w, http.StatusOK, cachedImages)
        return
    }

    images := handle.DM.GetParentDataAllImages(jobName, datasetName)
    var compressedImages []map[string]string
    for _, img := range images {
        base64Img := compressImages(img.Path)
        compressedImages = append(compressedImages, map[string]string{
            "name": img.Name,
            "data": base64Img,
        })
    }

    if handle.DM.JobCache.ImagesCache[jobName] == nil {
        handle.DM.JobCache.ImagesCache[jobName] = make(map[string][]map[string]string)
    }
    handle.DM.JobCache.ImagesCache[jobName][datasetName] = compressedImages
    writeJSON(w, http.StatusOK, compressedImages)
}

func compressImages(imgPath string) string {
    log.Println("Processing image:", imgPath)
    file, err := os.Open(imgPath)
    if err != nil {
        log.Println("Failed to open image:", err)
        return ""
    }
    defer file.Close()

    decodedImg, format, err := image.Decode(file)
    if err != nil {
        log.Printf("Failed to decode image (format: %s): %v\n", format, err)
        return ""
    }

    resizedImg := resize.Resize(150, 0, decodedImg, resize.Lanczos3)

    var buf bytes.Buffer
    opts := &webp.Options{Lossless: false, Quality: 25}
    if err := webp.Encode(&buf, resizedImg, opts); err != nil {
        log.Println("Failed to encode WebP:", err)
        return ""
    }

    return base64.StdEncoding.EncodeToString(buf.Bytes())
}
