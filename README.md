#Simple template for simple web projects.

##File structure:
    - ./dist - result content dir. Temp dir(tempJs, tempCss) may be deleted.
    - ./docs - directory for documentation files
    - ./markup - main sources code dir
	    - /modules - for your modules
		- /pages - for pages
		- /static - other resources(img, fonts, vendor js and css)
    - ./misc - for other data
    
+ gulp dev-task with watchers: *gulp* or *gulp dev* without watchers
+ after run dev task your app is available at *http://localhost:9007*
+ release gulp task: *gulp release*
