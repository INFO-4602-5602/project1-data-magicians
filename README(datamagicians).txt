#Team: Data Mag1icians
##Team Roles:

**Lila:** Front-end/visualizations, map view with P5<
**Adam:** Back-end/data processing, scripting with Python
**Matilda:** Front-end/visualizations, barchart with P5
**Danny:** Front-end/visualizations, piechart with P5
**Ben:** Back-end/data processing, data merging/statistics with Tableau/Excel/R 



How to Run:
Open the index.html file in a web browser. If using Chrome, you’ll have to use a local host like XAMP. Otherwise, it should be able to open in Firefox fine. 



Information About Visualizations:

We built three different visualizations that are interlinked and interactive. These include a barchart, a map view, and a piechart. 

Barchart
The barchart window contains statistics about building costs and net present value (NPV) for each market. You can filter by total(sum), median, or average. In addition, you can filter by locations that are already on network, or ones that are opportunities. Filter by clicking the relevant boxes. 

Map View
The map view window also contains information about building costs and NPV. You can select between viewing profits or costs, and then filter by ‘on network’ or ‘open opportunity’. Each point on the map represents a building, and hovering over gives more information about the buildings location. You can zoom in to narrow the scope of the map, and can pan by holding your cursor on a point and dragging. Clicking ‘details of selection’ generates a series of pie charts that gives statistics about industry type, product group, and building type under the currently selected view. 

Piechart
The piechart window gives descriptive information about the building types, product groups, and industries present in the current map view. This is expressed as a percent of the total sum of each respective category. Hovering over a pie slice will cause it to separate, and becoming highlighted. A popup will appear that contains the percentage and categorical information of the slice. 



Design process:
Our design process started with a period of prototyping. We constructed visualizations in Tableau, made paper sketches and lists, and ran our data through statistical analysis software. Doing these things were very useful, because the sheer size of the data was pretty overwhelming. Eventually, we were able to narrow down on the most important attributes. We realized that there were many unimportant attributes in the data, and that some were redundant. Some attributes we all agreed were important included building costs, NPV, and on/off network. 

The first visualization we designed (the barchart) came from prototyping on Tableau. We graphed building costs and network proximity by market, and compared differences between the mean, median, and total sum. Interestingly, changing the descriptive statistic changed which market was most desirable. Thus, we thought visualizing NPV and building costs in this manner would make a good jumping off point.

After the barchart, we decided to focus on a spatial representation of the data. Building a map seemed the most straightforward. At first, we built a completely dynamic map, but it was running really slow, so we decided to create a static map and a separate window with the data points to speed it up and maintain the interactivity. The main attributes we wanted to include in the map were profit and building costs. We also wanted to include ways to filter by on-network or open-opportunity clients, as these would be valuable targets for Zayo. This combination resulted in a very useful visualization, as Zayo would be able to not only view the distribution of high value clients between markets, but also identify valuable sub-markets within cities as well. 

Finally, for the third visualization, we wanted to include other attributes we thought were important, which were characteristics of the clients in a particular market or sub-market. These included the type of building being serviced, the product group, and the industry the client belonged to. We thought that it would be interested to make this dynamic to the map view. We decided to use pie charts to show the top 5 building types, products, or industries for a given latitude and longitude range. Integrating the pie charts into the map view provided a really nice layer of useful information, as well as another nice interaction. 

Overall, our design process started out in the prototyping phase, and then went through iterative cycles of front and back end development. We helped each other through each stage, but all had our own focus as well. 





