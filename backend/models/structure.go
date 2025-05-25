package models


type PendingReview struct {
    Items []PendingReviewItem `json:"items"`
}

type PendingReviewItem struct {
    Job     string `json:"job"`
    Dataset string `json:"dataset"`
    Image   string `json:"imagePath"`
}


type JobCache struct {
    Jobs map[string]Job `json:"jobs"`
    ImagesCache map[string]map[string][]map[string]string `json:"images_cache"`
}


type Parent struct {
    Jobs []string `json:"jobs"`
}

type Job struct {
    Name     string    `json:"name"`
    Datasets []Dataset `json:"datasets"`
}

type Dataset struct {
    Name   string  `json:"name"`
    Image []Image `json:"images"`
    Label []Label `json:"labels"`
}

type Image struct {
    Name string `json:"name"`
    Path string `json:"path"`
}

type Label struct {
    Name string `json:"name"`
    Path string `json:"path"`
}

