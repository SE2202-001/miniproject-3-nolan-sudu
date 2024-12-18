class Job 
{
    constructor(jobNo, title, jobPageLink, posted, type, level, estimatedTime, skill, detail) 
    { 
        this.jobNo = jobNo;
        this.title = title;
        this.jobPageLink = jobPageLink;
        this.posted = posted;
        this.type = type;
        this.level = level;
        this.estimatedTime = estimatedTime;
        this.skill = skill;
        this.detail = detail;
    }
}

let jobs = [];
let filteredJobs = [];

document.getElementById("file-upload").addEventListener("change", (event) => 
{ 
    const file = event.target.files[0];
    if (file) 
    { 
        const reader = new FileReader();
        reader.onload = (e) => 
        { 
            try 
            { 
                const data = JSON.parse(e.target.result);
                jobs = data.map(
                    (job) =>
                        new Job(
                            job["Job No"],
                            job.Title,
                            job["Job Page Link"],
                            job.Posted,
                            job.Type,
                            job.Level,
                            job["Estimated Time"],
                            job.Skill,
                            job.Detail
                        )
                );
                filteredJobs = jobs;
                populateFilters();
                displayJobs(filteredJobs);
            } 
            catch (err) 
            { 
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    }
});

function populateFilters() 
{ 
    const levels = new Set(jobs.map((job) => job.level));
    const types = new Set(jobs.map((job) => job.type));
    const skills = new Set(jobs.map((job) => job.skill));

    populateSelect("filter-level", levels);
    populateSelect("filter-type", types);
    populateSelect("filter-skill", skills);
}

function populateSelect(elementId, values) 
{ 
    const select = document.getElementById(elementId);
    select.innerHTML = `<option value="All">All</option>`;
    values.forEach((value) => 
    { 
        select.innerHTML += `<option value="${value}">${value}</option>`;
    });
}

function displayJobs(jobList) 
{ 
    const jobContainer = document.getElementById("job-list");
    jobContainer.innerHTML = "";
    if (jobList.length === 0) 
    { 
        jobContainer.innerHTML = "<p>No jobs match your criteria.</p>";
        return;
    }

    jobList.forEach((job) => 
    { 
        const jobDiv = document.createElement("div");
        jobDiv.className = "job-item";
        jobDiv.innerHTML = `
            <h3><a href="${job.jobPageLink}" target="_blank">${job.title}</a></h3>
            <p>Posted: ${job.posted}</p>
            <p>Type: ${job.type} | Level: ${job.level} | Skill: ${job.skill}</p>
            <p>Estimated Time: ${job.estimatedTime}</p>
            <button onclick="viewDetails('${job.detail}')">View Details</button>
        `;
        jobContainer.appendChild(jobDiv);
    });
}

document.getElementById("filter-jobs").addEventListener("click", () => 
{ 
    const level = document.getElementById("filter-level").value;
    const type = document.getElementById("filter-type").value;
    const skill = document.getElementById("filter-skill").value;

    filteredJobs = jobs.filter((job) => 
    { 
        return (
            (level === "All" || job.level === level) &&
            (type === "All" || job.type === type) &&
            (skill === "All" || job.skill === skill)
        );
    });

    displayJobs(filteredJobs);
});

document.getElementById("sort-button").addEventListener("click", () => 
{ 
    const sortBy = document.getElementById("sort-jobs").value;

    if (sortBy === "time") 
    { 
        filteredJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    } 
    else if (sortBy === "title") 
    { 
        filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    }

    displayJobs(filteredJobs);
});

function viewDetails(detail) 
{ 
    alert(`Job Detail:\n${detail}`);
}