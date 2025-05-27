package services

import (
	"log"
	"backend/models"
)

func (dm *DataManager) GetJobCache(jobName string) (models.Job, bool) {
	job, exists := dm.JobCache.Jobs[jobName]
	return job, exists
}

func (dm *DataManager) GetImagesCache(jobName, datasetName string) ([]map[string]string, bool) {
	cachedImages, exists := dm.JobCache.ImagesCache[jobName][datasetName]
	return cachedImages, exists
}

func (dm *DataManager) MergeJobCache(job models.Job) {
    if len(dm.JobCache.Jobs) >= 3 {
        for key := range dm.JobCache.Jobs {
            log.Printf("Removing job from cache: %s", key)
            delete(dm.JobCache.Jobs, key)
            break
        }
    }

    dm.JobCache.Jobs[job.Name] = job
    log.Printf("Added job to cache: %s", job.Name)
}
