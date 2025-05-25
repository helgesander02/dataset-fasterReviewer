package models


func NewJobCache() JobCache {
	return JobCache{
		Jobs: make(map[string]Job),	
		ImagesCache: make(map[string]map[string][]map[string]string), 
	}
}