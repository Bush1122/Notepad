const express = require ('express');
const app = express();
const path = require('path'); 
const fs = require('fs');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))


app.get('/', (req, res) => {
  fs.readdir('./files', function(err, files) {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
      }
      console.log(files);
      res.render('index', { files: files });
  });
});


app.post('/create', function(req, res) {
    const fileName = `./files/${req.body.title.split(' ').join('')}.txt`;
    const fileContent = req.body.details;

    fs.writeFile(fileName, fileContent, function(err) {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('An error occurred while creating the file.');
        }
        res.redirect('/');
    });

});

   

app.get('/files/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('An error occurred while reading the file.');
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});
 

app.get('/search', function(req, res) {
    const query = req.query.query.toLowerCase();
    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the query
        const filteredFiles = files.filter(file => file.toLowerCase().includes(query));
        res.render('index', { files: filteredFiles });
    });
});



app.listen(3000 , function(){
    console.log("Typing here")

})