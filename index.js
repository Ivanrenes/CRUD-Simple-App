


//mi primera vez usando Nvim como editor de texto en general para mis proyectos, es util?, si pero tardaras mucho en acostumbrarte



const db = firebase.firestore();

const taskForm = document.getElementById('task-form')
//se crea un div con el id taskContainer para poder asi crear las cartas dende aparecera la data
const taskContainer = document.getElementById('task-container')


let editStatus = false; // <= Es falsa porque el form tiene que guardar y el estado no se deberia editar todavia
let id = '';

const SaveTask = (title, description) => 

    db.collection('tasks').doc().set({
        title,
        description    
    })


//creamos una constante con funcion de obtener todas las teras de mi base de datos

    const getTask = () => db.collection('tasks').get(); 

    const getTasks = (id) => db.collection('tasks').doc(id).get();
    
    const onGetTask = (callback) => db.collection("tasks").onSnapshot(callback);

    const deleteTask = id => db.collection('tasks').doc(id).delete();

    const UpdateTask = (id, UpdateTask) => db.collection('tasks').doc(id).update(UpdateTask);

// esto sirve para cargar apenas carge el dom y va a traer todas las tareas de la base de datos
    window.addEventListener('DOMContentLoaded', async (e) => {
        //  <= nombre predeterminado que le da firebase a la funcion que trae todos los datos en forma de objeto
       
       
        onGetTask((querySnappshot)=> { 

            taskContainer.innerHTML = ``;
            querySnappshot.forEach(doc => {
                
     
                const task = doc.data();
                task.id = doc.id;
                
     
                taskContainer.innerHTML  +=  `<div class="card card-body mt-2 border-primary">
                 <h3>${task.title}</h3>
                 <p>${task.description}</p>
                 <div>
                     <buttom class="btn btn-danger  btn-delete" data-id="${task.id}" >Delete</buttom>
                     <buttom class="btn btn-primary  btn-edit"  data-id="${task.id}">Edit</buttom>
                 </div>
                </div>`

                //Eliminar
                const btnsDelete = document.querySelectorAll('.btn-delete');
                btnsDelete.forEach(btn => {
                    btn.addEventListener('click',async (e)=>{
                        console.log(btn)
                       await deleteTask(e.target.dataset.id)
                    })
                })
                // Editar
                const btnsEdit = document.querySelectorAll('.btn-edit');
                btnsEdit.forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const doc = await  getTasks(e.target.dataset.id)
                        console.log(doc.data())



                        editStatus = true;
                        id = doc.id;


                        const tasks = doc.data();
                        taskForm['task-title'].value = tasks.title;
                        taskForm['task-description'].value = tasks.description;

                        taskForm['btn-task-form'].innerText = 'update';
                    })
                })
            })
            
        })

        
    })

 // buscamos el documento por el id //

 // escuchamos el evento cuando presionemos el boton//
 taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = taskForm['task-title'];
    const description = taskForm['task-description'];
    

    //
    if(!editStatus){
        await SaveTask(title.value, description.value);

     //si esta en true entonces 
    }else{
       await UpdateTask(id,{
        title : title.value,
        description : description.value 
       })

       editStatus = false;
       id = '';
       taskForm['btn-task-form'].innerHTML = 'Save';
    }
   
    taskForm.reset(); /* esto es para resetear el formulario */
    title.focus();
})
