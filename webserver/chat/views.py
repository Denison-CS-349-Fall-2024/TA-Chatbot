from django.http import HttpResponse
from django.http import JsonResponse


def index(request):
        
        data = [
        {
            "isSentByUser": True,
            "content": "What is the lowest point in the world?"
        },
        {
            "isSentByUser": False,
            "content": "The lowest point on Earth's surface is the Challenger Deep, located in the Mariana Trench in the Pacific Ocean. It reaches a depth of about 36,000 feet (approximately 10,973 meters) below sea level. In terms of land, the lowest point is the shoreline of the Dead Sea, which lies around 1,410 feet (430 meters) below sea level."
        },
        {
            "isSentByUser": True,
            "content": "What country has the most natural lakes? How many?"
        },
        {
            "isSentByUser": False,
            "content": "Canada has the most natural lakes of any country in the world. It is estimated to have around 2 million lakes, covering a significant portion of its landscape. These lakes make up about 9 percent of Canada's total area, contributing to its diverse ecosystems and stunning natural beauty."
        },
        {
            "isSentByUser": True,
            "content": "What present-day Italian city does Mt. Vesuvius overlook? What are its geographical features?"
        },
        {
            "isSentByUser": True,
            "content": "Mt. Vesuvius overlooks the city of Naples, Italy. The volcano is part of the Campanian volcanic arc and is known for its iconic conical shape. The surrounding region features a mix of urban areas, fertile plains, and coastal landscapes along the Bay of Naples. The area is characterized by its Mediterranean climate, with hot, dry summers and mild, wet winters, which contributes to the lush vegetation in the region. The volcanic soil is particularly rich, making it suitable for agriculture, including vineyards and orchards."
        },]
        
        return JsonResponse(data, safe=False)
