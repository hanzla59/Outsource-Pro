class JobDTO{
    constructor(job){
        this.id = job.id;
        this.title = job.title;
        this.description = job.description;
        this.budget = job.budget;
        this.deadline = job.deadline;
        this.status = job.status;
        this.client = job.client; 
    }
}

module.exports = JobDTO;