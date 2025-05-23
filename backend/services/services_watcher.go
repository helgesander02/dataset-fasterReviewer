package services


import (
	"log"
	"os"
	"backend/models"
	"backend/utils"
)


func (dm *DataManager) ConcurrentJobScanner() {
    go utils.WatchJobs(dm.ImageRoot, &dm.ParentData)
    log.Printf("Watchers initialized for root directory: %s", dm.ImageRoot)
}


func (dm *DataManager) ConcurrentJobDetailsScanner(jobName string) (models.Job, bool) {
    jobPath := dm.ImageRoot + "/" + jobName
    _, err := os.Stat(jobPath)
    if err != nil {
        if os.IsNotExist(err) {
            log.Printf("Job directory does not exist: %s", jobPath)
        } else {
            log.Printf("Error accessing job directory: %v", err)
        }
        return models.NewJob(jobName), false
    }

    job, exists := dm.JobCache[jobName]
    if exists {
        log.Printf("Job found in cache: %s", jobName)
        return job, true
    }

    job = utils.WatchJobDetails(dm.ImageRoot, jobName)
    log.Printf("Job not found in cache, scanning: %s", jobName)
    dm.MergeJobCache(job)
    return job, true
}


func (dm *DataManager) MergeJobCache(job models.Job) {
    if len(dm.JobCache) >= 3 {
        for key := range dm.JobCache {
            log.Printf("Removing job from cache: %s", key)
            delete(dm.JobCache, key)
            break
        }
    }

    dm.JobCache[job.Name] = job
    log.Printf("Added job to cache: %s", job.Name)
}
