import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-material-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Modal toggle -->

    <button  data-modal-target="add-course-material-modal" data-modal-toggle="add-course-material-modal" type="button" class="block text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Add Course Material</button>

    <!-- Main modal -->
    <div id="add-course-material-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative p-4 w-full max-w-lg max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Upload New Class Material
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="add-course-material-modal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form class="p-4 md:p-5" (ngSubmit) = "onFileUpload()">
                    <div class="grid gap-4 mb-4 grid-cols-2">
                        <div class="col-span-2">
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Eg. Fall 2024 Syllabus">
                        </div>
                        <div class="col-span-2">
                        <!-- sm:col-span-1 Add this above to make it half of the width -->
                            <label for="upload-type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                            <select id="upload-type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option selected="">Select type</option>
                                <option value="syllabus">Syllabus</option>
                                <option value="assignment">Assignment</option>
                                <option value="quiz">Quiz</option>
                                <option value="readings">Reading Question</option>
                            </select>
                        </div>
                        <div class="col-span-2">
                          <div class="flex items-center justify-center w-full">
                              <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                      <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                      </svg>
                                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                      <p class="text-xs text-gray-500 dark:text-gray-400">PDF or docx (MAX. 7MB)</p>
                                  </div>
                                  <input (change)="onFileSelect($event)" id="dropzone-file" type="file" class="hidden" />
                              </label>
                          </div>
                        </div>
                    </div>
                    @if(this.selectedFile !== null){
                        <div class="my-2 text-sm text-gray-500 dark:text-gray-400">
                          Selected file: {{ this.selectedFile.name}}
                        </div>
                    }
                    <div class="col-span-2 sm:col-span-1 flex items-center mt-3">
                            <div class="flex">
                                <div class="flex items-center h-5">
                                    <input id="helper-checkbox" aria-describedby="helper-checkbox-text" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                </div>
                                <div class="ms-2 text-sm">
                                    <label for="helper-checkbox" class="font-medium text-gray-900 dark:text-gray-300">Enable file</label>
                                    <p id="helper-checkbox-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">Allow the chatbot to answer questions using this file</p>
                                </div>
                            </div>
                      </div>

                    <button data-modal-target="add-course-material-modal" data-modal-toggle="add-course-material-modal" type="submit" class="mt-5 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Upload</button>
                 </form>
            </div>
        </div>
    </div>
  `,

  styleUrl: './add-material-modal.component.css'
})
export class AddMaterialModalComponent {
  protected selectedFile: File | null = null;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }

  onFileUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      console.log(this.selectedFile)
      console.log(formData);
      // this.http.post('https://your-backend-api.com/upload', formData).subscribe(response => {
      //   console.log('File uploaded successfully', response);
      // }, error => {
      //   console.error('File upload failed', error);
      // });
    } else {
      console.error('No file selected!');
    }
  }
}
