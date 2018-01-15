# Oculus-3D-Visualization-Tool
A tool that allows the visualization  of data from a .csv file in a 3D virtual space.

## Getting Started

These instructions will show you how to get the web service up and running on your own local server.

### Prerequisites

```
- An internet connection
- Modern internet browser (Chrome, Firefox)
- Local server (see instructions below)
```
To properly run this web service you will need some sort of local web server installed.

You have many options but ones that are recommended are:
  1) [Python](https://www.python.org/)
  2) [Apache2](https://httpd.apache.org/) 

If you are on a UNIX system then it is most likely that you already have these installed.

Check for yourself:

- Python:
  In terminal enter:
    ```
    python --version
    ```
   If you get something like:
    ```
    Python 2.7.14
    ```
   Then you are good to go and can use python as a local server

- Apache2:
  In terminal enter:
    ```
    apache2 -v
    ```
   If you get something like:
    ```
    Server version: Apache/2.4.27 (Ubuntu)
    Server built:   2017-09-18T15:05:48
    ```
   Then you are good to go and can use apache2 as a local server

For ease of use we will use Python to host our local server. If you wish to look into how to host with Apache2 then you can
find more documentation here: https://httpd.apache.org/docs/trunk/en/getting-started.html


### Set up your local server

- Open terminal and navigate to the directory that you downloaded the repository to
- Type:     ```
           python -m SimpleHTTPServer 8080
           ```
- Leave terminal open and open your browser
- Navigate to http://localhost:8080/
- Done!


## Built With

* [Bootstrap](https://getbootstrap.com/) - Web template and front end
* [A-Frame](https://aframe.io/) - Web framework built on WebVR
* [three.js](https://threejs.org/) - JavaScript framework for 3D components

### Additional Tools

* [A-Frame Environment](https://github.com/feiss/aframe-environment-component/) - virtual environment library
* [Papa Parse](http://papaparse.com/) - .csv parsing library


## Authors

* **Jeremy Fehr** - *Project Manager* 
* **Scott Laskowski** - *Build Master*
* **Marcus Hamilton** - *Lead Developer*
* **Owen Smallwood** - *Lead Tester/Dev*
* **Hongyi Xue** - *Risk Officer* 
* **Davidson Eklund** - *Developer/Triage* 
* **Nicholas Seaboyer** - *Tester/Triage* 
* **Wynston Ramsay** - *Developer/Triage*
* **Fahd Hussain** - *Developer*  
* **Yu Gu** - *Tester* 
* **Justin Neumeyer** - *Tester*   


See also the list of [contributors](https://github.com/mah985/Oculus-3D-Visualization-Tool/graphs/contributors) who participated in this project.

## License

None as of yet.

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
