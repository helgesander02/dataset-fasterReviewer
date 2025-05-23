package utils

import (
	"log"
	"os"
	"path/filepath"
	"backend/models"
)


func WatchJobDetails(root string, jobName string) models.Job {
	jobData := models.NewJob(jobName)
	jobPath := filepath.Join(root, jobName)
	_, err := os.Stat(jobPath)
	if err != nil {
		if os.IsNotExist(err) {
			log.Printf("Job directory does not exist: %s", jobPath)
		} else {
			log.Printf("Error accessing job directory: %v", err)
		}
		return jobData
	}

	datasets, err := os.ReadDir(jobPath)
	if err != nil {
		log.Printf("Error reading datasets for job %s: %v", jobName, err)
		return jobData
	}

	for _, dataset := range datasets {
		if !dataset.IsDir() {
			continue
		}

		datasetData := scanDataset(jobPath, dataset)
		jobData.Datasets = append(jobData.Datasets, datasetData)
	}

	return jobData
}


func scanDataset(jobPath string, dataset os.DirEntry) models.Dataset {
	datasetData := models.NewDataset(dataset.Name())
	datasetPath := filepath.Join(jobPath, dataset.Name())
	metas, err := os.ReadDir(datasetPath)
	if err != nil {
		log.Printf("Error reading meta directories for dataset %s: %v", dataset.Name(), err)
		return datasetData
	}

	for _, meta := range metas {
		if !meta.IsDir() {
			continue
		}

		metaPath := filepath.Join(datasetPath, meta.Name())
		scanMeta(metaPath, meta.Name(), &datasetData)
	}

	return datasetData
}


func scanMeta(metaPath, metaName string, datasetData *models.Dataset) {
	if metaName == "image" {
		images, err := os.ReadDir(metaPath)
		if err != nil {
			log.Printf("Error reading images: %v", err)
			return
		}
		scanImages(images, metaPath, datasetData)
		
	} else if metaName == "label" {
		labels, err := os.ReadDir(metaPath)
		if err != nil {
			log.Printf("Error reading labels: %v", err)
			return
		}
		scanLabels(labels, metaPath, datasetData)
	}
}


func scanImages(images []os.DirEntry, metaPath string, datasetData *models.Dataset) {
	for _, image := range images {
		if !image.IsDir() && filepath.Ext(image.Name()) == ".jpg" {
			imagePath := filepath.Join(metaPath, image.Name())
			datasetData.Image = append(datasetData.Image, models.Image{Name: image.Name(), Path: imagePath})
		}
	}
}


func scanLabels(labels []os.DirEntry, metaPath string, datasetData *models.Dataset) {
	for _, label := range labels {
		if !label.IsDir() && filepath.Ext(label.Name()) == ".json" {
			labelPath := filepath.Join(metaPath, label.Name())
			datasetData.Label = append(datasetData.Label, models.Label{Name: label.Name(), Path: labelPath})
		}
	}
}
