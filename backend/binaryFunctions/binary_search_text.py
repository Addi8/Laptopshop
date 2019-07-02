import numpy as np

class BinarySearchText:

    def __init__(self, es):
        self.es = es

    

    def compute_binary_text(self, field_name,field_weight,field_values):
        # value could be a list of multiple terms

        result = []
        innerList = []
        for value in field_values:
          innerList.append({'match':{field_name: value}})

        print("innerList")
        print(innerList)


            # #The following is a case insensitive search
        body = {
        #           "query":{
        #             "bool":{
        #               "must":[
        #                 {
        #                   "match":{
        #                     field_name: value
        #                   }
        #                 }]
        #
        #             }
        #           }
        #         }

          "query": {
            "bool": {
              "should":
                innerList
            }
          }

        }

        res = self.es.search(index="amazon", body=body, size=10000)


        # Add list including [asin, fuzzycalc] to result. Fuzzy Calculation is between 0 and 1
        for hit in res['hits']['hits']:
            result.append([hit['_source']['asin'], field_weight*float(1.0)])

        # print("what is in \"result\"")
        # print(result)
        result = np.array(result, dtype=object)
        # print("what is in \"result\" with objects")  # why?
        # print(result)
        # result = result[np.argsort(-result[:, 1])] #sorts resuls with highest matching score first
        # print("what is in \"result\" with objects")  # why?
        # print(result)

        ##
        result = list(map(tuple, result))
        # print("result after mapping")
        # print(result)
        return result
