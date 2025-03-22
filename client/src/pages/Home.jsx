import React, { useEffect, useState, version } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null); 

  const [isEditModelShow, setIsEditModelShow] = useState(false);

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#000",
      borderColor: "#555",
      color: "#fff",
      padding: "5px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#000",
      color: "#fff",
      width: "100%",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#333" : "#000",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#aaa",
    }),
  };

  const getRunTimes = async () => {
    let res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    let data = await res.json();

    const filteredLanguages = [
      "python",
      "javascript",
      "c",
      "c++",
      "java",
    ];

    const options = data
      .filter((runtime) => filteredLanguages.includes(runtime.language))
      .map((runtime) => ({
        label: `${runtime.language} (${runtime.version})`,
        value: runtime.language === "c++" ? "cpp" : runtime.language,
        version: runtime.version,
      }));

    setLanguageOptions(options);
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
    console.log("Selected language:", selectedOption);
  };

  const [projects, setProjects] = useState(null);

  const getProjects = async () => {
    fetch(api_base_url + "/getProjects", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setProjects(data.projects);
        } else {
          toast.error(data.msg);
        }
      });
  };

  useEffect(() => {
    getProjects();
    getRunTimes();
  }, []);

  const createProj = () => {
    fetch(api_base_url + "/createProj", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        projLanguage: selectedLanguage.value,
        token: localStorage.getItem("token"),
        version: selectedLanguage.version,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setName("");
          navigate("/editior/" + data.projectId);
        } else {
          toast.error(data.msg);
        }
      });
  };

  const deleteProject = (id) => {
    let conf = confirm("Are you sure you want to delete this project?");
    if (conf) {
      fetch(api_base_url + "/deleteProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: id,
          token: localStorage.getItem("token"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            getProjects();
          } else {
            toast.error(data.msg);
          }
        });
    }
  };

  const [editProjId, setEditProjId] = useState("");

  const updateProj = () => {
    fetch(api_base_url + "/editProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: editProjId,
        token: localStorage.getItem("token"),
        name: name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsEditModelShow(false);
          setName("");
          setEditProjId("");
          getProjects();
        } else {
          toast.error(data.msg);
          setIsEditModelShow(false);
          setName("");
          setEditProjId("");
          getProjects();
        }
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center px-[100px] justify-between mt-5">
        <h3 className="text-2xl">Welcome To Multicode Editor</h3>
        <div className="flex items-center">
          <button
            onClick={() => {
              setIsCreateModelShow(true);
            }}
            className="btnNormal bg-blue-500 transition-all hover:bg-blue-600"
          >
            Create Project
          </button>
        </div>
      </div>

      <div className="projects px-[100px] mt-5 pb-10">
        {projects && projects.length > 0
          ? projects.map((project, index) => {
              return (
                <>
                  <div className="project w-full p-[15px] flex items-center justify-between bg-[#0f0e0e]">
                    <div
                      onClick={() => {
                        navigate("/editior/" + project._id);
                      }}
                      className="flex w-full items-center gap-[15px]"
                    >
                      {project.projLanguage === "python" ? (
                        <>
                          <img
                            className="w-[150px] h-[100px] object-cover"
                            src="https://img-c.udemycdn.com/course/480x270/919038_3ae1_11.jpg"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "javascript" ? (
                        <>
                          <img
                            className="w-[150px] h-[100px] object-cover"
                            src="data:image/jpeg;base64,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"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "cpp" ? (
                        <>
                          <img
                            className="w-[150px] h-[100px] object-cover"
                            src="https://blog.eduonix.com/wp-content/uploads/2016/02/c.jpg"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "c" ? (
                        <>
                          <img
                            className="w-[150px] h-[100px] object-cover "
                            src="https://media.licdn.com/dms/image/v2/C5612AQEe2NcU8hQtvA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1643807289821?e=2147483647&v=beta&t=GP79FLc31HPAqD9597b_VXe1Rzeq4j3RQhjhqaSlplA"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "java" ? (
                        <>
                          <img
                            className="w-[150px] h-[100px] object-cover"
                            src="https://cdn.hashnode.com/res/hashnode/image/upload/v1712969372658/114c7a7b-5826-46a7-9a8b-2efa94ee8920.jpeg"
                            alt=""
                          />
                        </>
                      ) : (
                        ""
                      )}
                      <div>
                        <h3 className="text-xl">{project.name}</h3>
                        <p className="text-[14px] text-[gray]">
                          {new Date(project.date).toDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-[15px]">
                      <button
                        className="btnNormal bg-blue-500 transition-all hover:bg-blue-600"
                        onClick={() => {
                          setIsEditModelShow(true);
                          setEditProjId(project._id);
                          setName(project.name);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteProject(project._id);
                        }}
                        className="btnNormal bg-red-500 transition-all hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              );
            })
          : "No Project Found !"}
      </div>

      {isCreateModelShow && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modelCon")) {
              setIsCreateModelShow(false);
              setName("");
            }
          }}
          className="modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]"
        >
          <div className="modelBox flex flex-col items-start rounded-xl p-[20px] w-[25vw] h-[auto] bg-[#0F0E0E]">
            <h3 className="text-xl font-bold text-center">Create Project</h3>
            <div className="inputBox">
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                type="text"
                placeholder="Enter your project name"
                className="text-black"
              />
            </div>
            <Select
              placeholder="Select a Language"
              options={languageOptions}
              styles={customStyles}
              onChange={handleLanguageChange}
            />
            {selectedLanguage && (
              <>
                <p className="text-[14px] text-green-500 mt-2">
                  Selected Language: {selectedLanguage.label}
                </p>
                <button
                  onClick={createProj}
                  className="btnNormal bg-blue-500 transition-all hover:bg-blue-600 mt-2"
                >
                  Create
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isEditModelShow && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modelCon")) {
              setIsEditModelShow(false);
              setName("");
            }
          }}
          className="modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]"
        >
          <div className="modelBox flex flex-col items-start rounded-xl p-[20px] w-[25vw] h-[auto] bg-[#0F0E0E]">
            <h3 className="text-xl font-bold text-center">Update Project</h3>
            <div className="inputBox">
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                type="text"
                placeholder="Enter your project name"
                className="text-black"
              />
            </div>

            <button
              onClick={updateProj}
              className="btnNormal bg-blue-500 transition-all hover:bg-blue-600 mt-2"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
